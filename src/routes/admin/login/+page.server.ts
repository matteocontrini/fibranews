import { verifyTelegramAuth } from '$lib/server/telegram';
import { SessionEntity, UserEntity } from '$lib/server/db/schema';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

const authDateGracePeriod = 60 * 60 * 1000;

export async function load({ url, cookies, locals }) {
	const { telegramId, photoUrl, authDate, hash } = extractTelegramParams(url.searchParams);

	if (hash && telegramId && authDate) {
		const isValid = verifyTelegramAuth(url.searchParams);
		if (!isValid) {
			throw new Error('Invalid Telegram auth');
		}

		if (Date.now() - +authDate * 1000 > authDateGracePeriod) {
			throw new Error('Telegram auth expired');
		}

		const accessToken = await login(telegramId, photoUrl);

		if (!accessToken) {
			throw new Error('User not found');
		}

		cookies.set('fibranews_session', accessToken, {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: !dev,
			maxAge: 3600 * 24 * 60 // 60 days
		});

		return redirect(302, '/admin');
	}

	if (locals.user) {
		return redirect(302, '/admin');
	}

	return {
		seo: {
			title: 'Fibra.news ADMIN'
		}
	};
}

function extractTelegramParams(params: URLSearchParams) {
	return {
		telegramId: params.get('id'),
		photoUrl: params.get('photo_url'),
		authDate: params.get('auth_date'),
		hash: params.get('hash')
	};
}

async function login(telegramId: string, photoUrl: string | null) {
	const user = await UserEntity.findOne({
		where: {
			telegramId: telegramId
		}
	});

	if (!user) {
		return null;
	}

	user.photoUrl = photoUrl;
	user.lastLoginAt = new Date();

	await user.save();

	const session = await createSession(user);

	return session.token;
}

async function createSession(user: UserEntity) {
	const token = generateSessionToken();
	const session = new SessionEntity();
	session.token = token;
	session.user = user;
	await session.save();
	return session;
}

function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}
