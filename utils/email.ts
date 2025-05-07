import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter with AWS SES SMTP
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-west-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USERNAME,
    pass: process.env.AWS_SES_SMTP_PASSWORD
  },
  debug: process.env.NODE_ENV === 'development'
});

// Debug logging
console.log('AWS Configuration:');
console.log('Region:', process.env.AWS_REGION);
console.log('Access Key ID length:', process.env.AWS_SES_SMTP_USERNAME?.length);
console.log('Secret Key length:', process.env.AWS_SES_SMTP_PASSWORD?.length);

interface Child {
  name: string;
  birthday: string;
}

interface EnrollmentData {
  parentName: string;
  email: string;
  phone: string;
  interestedDays: string[];
  children: Child[];
}

export const sendAdminEmail = async (data: EnrollmentData) => {
  // Format children info
  const childrenInfo = data.children.map(child => 
    `<tr>
      <td><strong>${child.name}</strong></td>
      <td>${child.birthday}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: {
      name: 'Lil Farm Hill',
      address: 'contact@lilfarmhill.com'
    },
    to: 'contact@lilfarmhill.com',
    subject: 'New Enrollment Inquiry',
    html: `
      <h2>New Enrollment Inquiry</h2>
      <p><strong>Parent's Name:</strong> ${data.parentName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Interested Days:</strong> ${data.interestedDays.join(', ') || 'None selected'}</p>
      
      <h3>Children Information:</h3>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>Name</th>
          <th>Birthday</th>
        </tr>
        ${childrenInfo}
      </table>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin email:', error);
    throw error;
  }
};

export const sendUserConfirmationEmail = async (data: EnrollmentData) => {
  // Format children info
  const childrenListItems = data.children.map(child => 
    `<li><strong>${child.name}</strong> - Birthday: ${child.birthday}</li>`
  ).join('');

  const mailOptions = {
    from: {
      name: 'Lil Farm Hill',
      address: 'contact@lilfarmhill.com'
    },
    to: data.email,
    subject: 'Thank you for your Enrollment Inquiry',
    html: `
      <h2>Thank you for your interest in Lil Farm Hill!</h2>
      <p>Dear ${data.parentName},</p>
      <p>We have received your enrollment inquiry and will get back to you shortly. Here's a summary of your submission:</p>
      
      <h3>Your Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.parentName}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
        <li><strong>Interested Days:</strong> ${data.interestedDays.join(', ') || 'None selected'}</li>
      </ul>
      
      <h3>Children Information:</h3>
      <ul>
        ${childrenListItems}
      </ul>
      
      <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Lil Farm Hill Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    throw error;
  }
}; 
