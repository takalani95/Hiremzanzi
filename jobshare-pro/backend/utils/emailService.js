const nodemailer = require('nodemailer');

// For development, use Ethereal Email (test service)
// In production, use your actual email service (Gmail, SendGrid, etc.)

let transporter;

// Initialize email transporter
const initializeEmailService = async () => {
  try {
    // For production, use environment variables
    if (process.env.EMAIL_SERVICE === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      // For development/testing - uses Ethereal Email (free test emails)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Using Ethereal Email for testing');
    }
  } catch (error) {
    console.error('Email service initialization error:', error);
  }
};

// Send email when new application is received
const sendApplicationConfirmationEmail = async (applicantEmail, applicantName, jobTitle, company) => {
  try {
    const mailOptions = {
      from: 'noreply@jobshare.com',
      to: applicantEmail,
      subject: `Application Received - ${jobTitle} at ${company}`,
      html: `
        <h2>Application Confirmation</h2>
        <p>Hi ${applicantName},</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
        <p>We have received your application and it has been submitted to the employer. They will review your application and contact you if they would like to move forward.</p>
        <p>You can track your application status in your <a href="${process.env.FRONTEND_URL}/dashboard">Hire Mzansi Dashboard</a>.</p>
        <hr/>
        <p>Best regards,<br/>The Hire Mzansi Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send email to employer when new application is received
const sendEmployerNotificationEmail = async (employerEmail, applicantName, jobTitle, applicationUrl) => {
  try {
    const mailOptions = {
      from: 'noreply@jobshare.com',
      to: employerEmail,
      subject: `New Application for ${jobTitle}`,
      html: `
        <h2>New Application Received</h2>
        <p>You have received a new application from <strong>${applicantName}</strong> for the <strong>${jobTitle}</strong> position.</p>
        <p>
          <a href="${applicationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Application
          </a>
        </p>
        <p>Log in to your <a href="${process.env.FRONTEND_URL}/dashboard">Hire Mzansi Dashboard</a> to review and manage applications.</p>
        <hr/>
        <p>Best regards,<br/>The Hire Mzansi Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Employer notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending employer notification email:', error);
  }
};

// Send status update email to applicant
const sendApplicationStatusEmail = async (applicantEmail, applicantName, jobTitle, newStatus) => {
  try {
    const statusMessages = {
      pending: 'Your application is being reviewed.',
      reviewed: 'The employer has reviewed your application.',
      accepted: 'Congratulations! The employer is interested in your application.',
      rejected: 'Thank you for your application. The employer has decided to move forward with other candidates.'
    };

    const mailOptions = {
      from: 'noreply@jobshare.com',
      to: applicantEmail,
      subject: `Application Status Update - ${jobTitle}`,
      html: `
        <h2>Application Status Update</h2>
        <p>Hi ${applicantName},</p>
        <p>Your application status for the <strong>${jobTitle}</strong> position has been updated.</p>
        <p><strong>Status: ${newStatus.toUpperCase()}</strong></p>
        <p>${statusMessages[newStatus] || 'Your application status has been updated.'}</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/dashboard">View Your Applications</a>
        </p>
        <hr/>
        <p>Best regards,<br/>The Hire Mzansi Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending status email:', error);
  }
};

module.exports = {
  initializeEmailService,
  sendApplicationConfirmationEmail,
  sendEmployerNotificationEmail,
  sendApplicationStatusEmail
};
