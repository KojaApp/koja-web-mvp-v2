import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Row,
} from "@react-email/components";
import * as React from "react";

interface KojaPaymentEmailProps {
  firstName?: string;
  paymentReference?: string;
  paymentDate?: string;
}

export const KojaPaymentEmail = ({
  firstName,
  paymentReference,
  paymentDate,
}: KojaPaymentEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address to finish registration</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Payment Confirmation</Heading>
        </Section>
        <Section style={body}>
          <Row>
            <Text style={text}>
              Your recent payment has successfully been created. Please see
              below for the payment details:
            </Text>
          </Row>
          <Row>
            <Column style={{ ...text, fontWeight: "800" }} colSpan={1}>
              Payment reference:
            </Column>
            <Column style={text} colSpan={1}>
              {paymentReference}
            </Column>
          </Row>
          <Row>
            <Column style={{ ...text, fontWeight: "800" }} colSpan={1}>
              Payment expected:
            </Column>
            <Column style={text} colSpan={1}>
              {paymentDate}
            </Column>
          </Row>
          <Text
            style={{
              ...text,
              color: "#ababab",
              marginTop: "14px",
              marginBottom: "16px",
            }}
          >
            If you didn't try to register, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            <Link
              href="https://dev.trykoja.com"
              target="_blank"
              style={{ ...link, color: "#898989" }}
            >
              Koja
            </Link>
            Childcare payments made simple.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

KojaPaymentEmail.PreviewProps = {
  loginCode: "sparo-ndigo-amurt-secan",
} as KojaPaymentEmailProps;

export default KojaPaymentEmailProps;

const main = {
  backgroundColor: "#f6f9fc",
};

const container = {
  paddingLeft: "0px",
  paddingRight: "0px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const header = {
  backgroundColor: "#0A2540",
};

const body = {
  paddingLeft: "20px",
  paddingRight: "20px",
};

const h1 = {
  color: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  Align: "center",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "16px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
