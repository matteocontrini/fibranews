import { SHA256, sha256 } from '@oslojs/crypto/sha2';
import { hmac } from '@oslojs/crypto/hmac';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { env } from '$env/dynamic/private';

export function verifyTelegramAuth(params: URLSearchParams) {
	const expectedHash = params.get('hash')!;
	params.delete('hash');

	const dataCheckArr = Array.from(params.entries())
		.map(([key, value]) => `${key}=${value}`)
		.sort();

	const dataCheckString = dataCheckArr.join('\n');

	const botToken = new TextEncoder().encode(env.TELEGRAM_BOT_TOKEN);

	const secretKey = sha256(botToken);
	const hash = hmac(SHA256, secretKey, new TextEncoder().encode(dataCheckString));

	return expectedHash === encodeHexLowerCase(hash);
}
