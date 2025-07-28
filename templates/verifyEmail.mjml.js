export const verifyEmailTemplate = (name, verificationPin) => `
<mjml>
  <mj-head>
    <mj-font name="Poppins" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" />
    <mj-attributes>
      <mj-all font-family="Poppins, Arial, sans-serif" />
      <mj-section padding-left="15px" padding-right="15px" />
      <mj-column width="100%" />
    </mj-attributes>
    <mj-style inline="inline">
      .pin-box {
        background-color: #f0f4ff;
        border: 2px dashed #4f46e5;
        border-radius: 10px;
        padding: 20px;
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #1e3a8a;
        text-align: center;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
      }
      @media screen and (max-width: 480px) {
        .pin-box {
          font-size: 24px;
          padding: 15px;
          letter-spacing: 4px;
        }
      }
    </mj-style>
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
          <mj-text align="center" font-size="22px" line-height="1.4" font-weight="600" color="#1e3a8a">
            Hello ${name}, welcome to the community! 🎉
          </mj-text>

          <mj-text align="center" color="#555555" padding-bottom="20px">
            To verify your email address, please enter the verification PIN below:
          </mj-text>

          <mj-text align="center" padding="10px 0">
            <span class="pin-box">${verificationPin}</span>
          </mj-text>

          <mj-text align="center" font-size="14px" color="#888888" line-height="1.6">
            This PIN will expire in 24 hours. If you did not create this account, you can safely ignore this email.
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
