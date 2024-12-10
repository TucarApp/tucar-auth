const BASE_URL = 'http://localhost:3000/bond-uber';

const params = {
    user_id: "7574b9f3-7eff-4337-9323-6b3a2374b871",
    client_id: "QT6xCtFyNRNPSsopvf4gbSxhPgxuzV3at4JoSg0YG7s",
    redirect_uri: "http://localhost:3000",
    tenancy: "production",
    token: "AC.-q6NnnKDsTjkDXjkd9p5dobos4mU-Iqy5dOnRAhrKSmR8nEvj6ZhC5BjV6hz-QfJNeVt0gkcMu4jz263OoKWfBjKSZRI0gBxMFVHRdlTV0Ja4ppmpFo9MQDiF8C4aNUuSsoxuoJxvkvMy2XEXDNBYeYIWsUcAlMprsoqvQ.QtLGc8ZC69vCVpyFjQ_OxFqVR9e7loyOay8fLA9Nqfd8UoRfw5vtCxdQ0QNuP8pAejcbPZ3NaobxWyGxvcu-Zsm80_AccCx1kjs_qjCUM4Ux4sWkxuulLOB7J0v9GU1g2RRZFUuhHGbuwzMRNxhY7qHEOwe-fL_crxryihQOZL0IMrmAOXNxcnwsx_a_TwLu4pLrx_I-SYHF3bV00HsvCY7GNVp7PA5ntnKFUEeQkrWid_bP8BFopP7P8qNyquqVqM4zvs_KwUhz6qj-Iab2TvlQF4xZ1zImIC9aLc8Zlgtk9qeMVZ05thJMmR0l3NPu9Mb6Ih9v_FRhsiq0vp3l1w"
};

const buildRequestParams = (params) =>
    Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

export const buildAuthUri = () => {
    return `${BASE_URL}?${buildRequestParams(params)}`;
};

// Debug para verificar el resultado
console.log('AUTH_URI:', buildAuthUri());
