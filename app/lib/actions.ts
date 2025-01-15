'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from "uuid"
import z from 'zod';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

const RegisterUser = z.object({
  name: z.string({
    invalid_type_error: 'Please enter your name.',
  }),
  email: z.string({
    invalid_type_error: 'Please enter an email address.',
  }),
  password: z.string({
    invalid_type_error: 'Please enter a password.',
  }),
  confirmPassword: z.string({
    invalid_type_error: 'Please confirm your password.',
  }),
})

const AddingChild = z.object({
  name: z.string({
    invalid_type_error: 'Please enter child name.',
  }),
  DOB: z.string({
    invalid_type_error: 'Please add date of birth.',
  }),
  TFC: z.string({
    invalid_type_error: 'Please enter tax-free childcare account reference.',
  }),
});

const AddingInvoice = z.object({
  childId: z.string({
    invalid_type_error: 'Please select a child.',
  }),
  amount: z.string({
    invalid_type_error: 'Please enter an amount.',
  }),
  status: z.string({
    invalid_type_error: 'Please set a status.',
  }),
    dueDate: z.string({
      invalid_type_error: 'Please set a due date.',  
    
  }),
});

export async function register(
  prevState: string | null,
  formData: FormData,
) {

  const validatedFields = RegisterUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return "Missing Fields. Failed to Create Account."
  }

  const { name, email, password, confirmPassword } = validatedFields.data

  // Check if passwords match
  if (password !== confirmPassword) {
    return "Passwords don't match."
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const id = uuidv4()

  try {
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${id}, ${name}, ${email}, ${hashedPassword})
    `
  } catch (error) {
    return "Database Error: Failed to Create Account."
  }

  redirect('/login')
}

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function addInvoice(prevState: string | null, formData: FormData) {
  const validatedFields = AddingInvoice.safeParse({
    childId: formData.get('childId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    dueDate: formData.get('dueDate'),
  });

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.errors);
    return "Missing Fields. Failed to Add Invoice.";
  }

  const { childId, amount, status, dueDate } = validatedFields.data;
  const childName = formData.get('childName');

  if (!childName) {
    console.error("Validation Error: Missing child's name.");
    return "Missing child's name. Failed to Add Invoice.";
  }

  const invoiceId = uuidv4();
  const createdDate = new Date().toISOString();

  try {
    await sql`
      INSERT INTO invoices (invoice_id, child_id, name, amount, status, created_date, due_date)
      VALUES (${invoiceId}, ${childId}, ${childName}, ${amount}, ${status}, ${createdDate}, ${dueDate})
    `;
    console.log("Invoice successfully added:", {
      invoiceId,
      childId,
      childName,
      amount,
      status,
      createdDate,
      dueDate,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return "Database Error: Failed to Add Invoice.";
  }

  redirect('/dashboard/invoices');
}




export async function addChild(prevState: string | null, formData: FormData) {
  const validatedFields = AddingChild.safeParse({
    name: formData.get('name'),
    DOB: formData.get('DOB'),
    TFC: formData.get('TFC'),
  });

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.errors);
    return { success: false, error: "Missing Fields. Failed to Create Account." };
  }

  const { name, DOB, TFC } = validatedFields.data;
  const child_id = uuidv4();

  console.log("Attempting to insert child:", { child_id, name, DOB, TFC });

  try {
    await sql`
      INSERT INTO children (child_id, child_name, child_dob, tfc_account_ref)
      VALUES (${child_id}, ${name}, ${DOB}, ${TFC})
    `;
    console.log("Child successfully added:", { child_id, name, DOB, TFC });
    return { success: true };  // Ensure this is returned as an object
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Database Error: Failed to Create Account." };  // Return error object
  }
}





