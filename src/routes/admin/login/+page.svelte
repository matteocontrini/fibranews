<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<div class="container mt-14 flex justify-center">
	<script async src="https://telegram.org/js/telegram-widget.js?22"
					data-telegram-login={env.PUBLIC_TELEGRAM_BOT_USERNAME}
					data-size="large"
					data-auth-url="{env.PUBLIC_BASE_URL}/admin/login"></script>
</div>
