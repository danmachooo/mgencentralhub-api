import { auth } from "@/lib/auth"
import { toFetchHeaders } from "../../helpers/shared/toFetchHeaders.helper"
import { signInSchema, signUpSchema } from "@/features/Auth-test/schema"
import { asyncHandler } from "@/middlewares"
import type { HttpContext } from "@/types/shared/httpContext.type"
import type { IncomingHttpHeaders } from "http"

type User = {
	name: string
	email: string
	password: string
}

type SignUpParams = User
type SignInParams = Pick<User, "email" | "password">

export async function signUp(user: SignUpParams) {
	return await auth.api.signUpEmail({
		body: {
			name: user.name,
			email: user.email,
			password: user.password,
		},
	})
}

export async function signIn(user: SignInParams) {
	const data = await auth.api.signInEmail({
		returnHeaders: true,
		body: {
			email: user.email, // required
			password: user.password, // required
		},
		// This endpoint requires session cookies.
		// headers: await headers(),
	})
	return data
}

export async function getSession(headers: IncomingHttpHeaders) {
	const session = await auth.api.getSession({
		headers: toFetchHeaders(headers),
	})

	return session
}

export const signUpHandler = asyncHandler(async (http: HttpContext) => {
	const { name, email, password } = signUpSchema.parse(http.req.body)

	await signUp({
		name,
		email,
		password,
	})

	return http.res.status(201).json({
		success: true,
		message: "User has been registered.",
	})
})

export const signInHandler = asyncHandler(async (http: HttpContext) => {
	const { email, password } = signInSchema.parse(http.req.body)

	const { headers, response } = await signIn({
		email,
		password,
	})

	const setCookie = headers.get("set-cookie")

	if (setCookie) {
		http.res.append("set-cookie", setCookie)
	}

	return http.res.status(200).json({
		success: true,
		message: "User is logged in..",
		data: response,
	})
})

export const getSessionHandler = asyncHandler(async (http: HttpContext) => {
	const session = await getSession(http.req.headers)
	return http.res.status(200).json({
		success: true,
		message: "Current Session has been retrieved",
		session,
	})
})
