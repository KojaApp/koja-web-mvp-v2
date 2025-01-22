import { sql } from '@vercel/postgres';
import {
  ChildField,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { auth } from '@/auth';

// export async function fetchRevenue() {
//   try {
//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     // console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, children.child_name, children.image_url, invoices.id
      FROM invoices
      JOIN children ON invoices.child_id = children.child_id
      ORDER BY invoices.due_date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
  const ITEMS_PER_PAGE = 20;
export async function fetchInvoicesForUser(currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const session = await auth(); // Get session from auth

  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  // Get user_id using email
  const userQuery = await sql`
    SELECT id
    FROM users
    WHERE email = ${session.user.email}
  `;
  const user = userQuery.rows[0];

  if (!user) {
    throw new Error('User not found');
  }

  try {
    // Fetch invoices for the user
    const invoices = await sql`
      SELECT
    invoices.invoice_id,
    invoices.amount,
    invoices.due_date,
    invoices.status,
    invoices.child_id,
    invoices.name,
    children.child_name,
    children.image_url
  FROM invoices
  JOIN children ON invoices.child_id = children.child_id
  WHERE children.user_id = ${user.id}  -- Find children associated with the user
  ORDER BY invoices.due_date DESC
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export function filterInvoices(invoices: any[], query: string) {
  return invoices.filter((invoice) => {
    return (
      invoice.child_name.toLowerCase().includes(query.toLowerCase()) ||
      invoice.amount.toString().includes(query) ||
      invoice.due_date.toString().includes(query) ||
      invoice.status.toLowerCase().includes(query.toLowerCase())
    );
  });
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchChildren() {
  try {
    // Retrieve the authenticated user's session using email to get user.id
    const session = await auth();  // Or use getSession() if you're using that
    console.log('Session data:', session);  // Log the session to see the structure
    if (!session || !session.user) {
      throw new Error('User not authenticated.');
    }

    const userEmail = session.user.email;
    console.log('User Email:', userEmail);  // Log the email

    // Query the database to get the user ID from the email
    const userQuery = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `;
    console.log('User query result:', userQuery);  // Log the query result to check if we get the ID

    const userId = userQuery.rows[0]?.id;  // Make sure to access the correct row to get the id

    if (!userId) {
      throw new Error('User not found for email: ' + userEmail);
    }

    // Debug: log the userId before querying children
    console.log('User ID:', userId);

    // Corrected query to fetch the user's children
    const data = await sql<ChildField>`
      SELECT
        child_id,
        child_name
      FROM children
      WHERE user_id = ${userId} 
      ORDER BY child_name ASC
    `;

    console.log('Fetched children data:', data);  // Log the fetched data
    const children = data.rows;
    return children;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch children for the authenticated user.');
  }
}


export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
