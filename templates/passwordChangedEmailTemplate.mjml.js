export const passwordChangedTemplate = (name) => `
<mjml>
  <mj-head>
    <mj-font name="Poppins" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" />
    <mj-attributes>
      <mj-all font-family="Poppins, Arial, sans-serif" />
    </mj-attributes>
  </mj-head>

  <mj-body background-color="#f4f6f8" width="600px">
    <mj-wrapper padding="0 20px">
      <mj-section padding="0">
        <mj-column>
          <mj-image src="https://yourdomain.com/logo.png" alt="Logo" width="120px" padding="24px 0" align="center" />
        </mj-column>
      </mj-section>

      <mj-section background-color="#ffffff" border-radius="12px" padding="40px 24px">
        <mj-column>
          <mj-text align="center" font-size="22px" font-weight="600" color="#1e3a8a">
            Hi ${name}, your password was successfully changed.
          </mj-text>

          <mj-text align="center" font-size="16px" color="#555555" padding-top="12px">
            If you did not perform this action, please contact our support team immediately.
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section padding-top="20px">
        <mj-column>
          <mj-text font-size="12px" color="#aaa" align="center" line-height="1.4">
            © 2025 Your Company. All rights reserved.
          </mj-text>
          <mj-text font-size="12px" color="#aaa" align="center" line-height="1.4">
            yourcompany.com · support@yourcompany.com
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
`;
