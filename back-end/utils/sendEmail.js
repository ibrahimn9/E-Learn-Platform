import nodemailer from 'nodemailer'

export default sendEmail = async (options) => {
	// 1) create a transporter (the service that will send email like : "Gmail","mailGun","mailTrap","Send Grid")

	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT, // if secure false port will be 587 , if true port will be 465
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false, // reject
		},
	});
	// 2) Define email Options (like : from, to, subject,email content)
	const emailOptions = {
		from: `E-COMMERCE APP < ${process.env.EMAIL_USER} >`,
		to: options.email,
		subject: options.subject,
		html: options.message,
	};
	// 3) send email
	await transporter.sendMail(emailOptions);
};