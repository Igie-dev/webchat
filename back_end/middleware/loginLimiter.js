import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
	windowMs: 60 * 100,
	max: 5,
	message: {
		message:
			"Too many login attempts from this IP, please try again after 60 seconds pause",
	},
	handler: (req, res, next, options) => {
		res.status(options.statusCode).send(options.message);
	},
	standardHeaders: true, //*Return rate limit info in the 'RateLimit-*' headers
	legacyHeaders: false, //*Disable the 'X-RateLimit-*' headers
});

export default loginLimiter;
