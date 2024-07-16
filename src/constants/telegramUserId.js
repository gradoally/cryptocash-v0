import WebApp from "@twa-dev/sdk"

let tg_user_id = 0

try {tg_user_id = WebApp.initDataUnsafe.user.id;}
catch {tg_user_id = 100;}

export default tg_user_id