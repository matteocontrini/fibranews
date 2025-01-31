import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	return {
		user: {
			photoUrl: locals.user.photoUrl
		},
		seo: {
			title: 'Fibra.news ADMIN'
		}
	};
}
