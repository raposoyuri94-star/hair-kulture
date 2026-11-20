// Keep links and public assets working both at / and on GitHub project Pages.
export const siteUrl = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');
export const sitePath = () => '/' + window.location.pathname.slice(import.meta.env.BASE_URL.length).replace(/^\//, '');
