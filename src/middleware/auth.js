<<<<<<< HEAD
export const verificarAdm = (req, res, next) => {
    if (req.body.tipo === "adm") {
=======
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "gastro-bar-secret";

const criarBase64Url = (valor) => Buffer.from(valor).toString("base64url");
const lerBase64Url = (valor) => Buffer.from(valor, "base64url").toString("utf8");

const gerarAssinatura = (headerBase64, payloadBase64) => {
    return crypto.createHmac("sha256", JWT_SECRET)
        .update(`${headerBase64}.${payloadBase64}`)
        .digest("base64url");
};

export const criarToken = (payload) => {
    const header = { alg: "HS256", typ: "JWT" };
    const headerBase64 = criarBase64Url(JSON.stringify(header));
    const payloadBase64 = criarBase64Url(JSON.stringify(payload));
    const assinatura = gerarAssinatura(headerBase64, payloadBase64);

    return `${headerBase64}.${payloadBase64}.${assinatura}`;
};

export const validarToken = (token) => {
    if (!token) {
        return null;
    }

    const partes = token.split(".");

    if (partes.length !== 3) {
        return null;
    }

    const [headerBase64, payloadBase64, assinatura] = partes;
    const assinaturaEsperada = gerarAssinatura(headerBase64, payloadBase64);

    if (assinatura !== assinaturaEsperada) {
        return null;
    }

    try {
        return JSON.parse(lerBase64Url(payloadBase64));
    } catch {
        return null;
    }
};

const parseCookies = (cookieHeader = "") => {
    return cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .filter(Boolean)
        .reduce((acc, item) => {
            const [key, ...rest] = item.split("=");
            acc[key] = decodeURIComponent(rest.join("="));
            return acc;
        }, {});
};

const obterTipoUsuario = (req) => {
    const token = req?.headers?.authorization?.replace(/^Bearer\s+/i, "");
    const usuarioToken = validarToken(token);

    if (usuarioToken?.tipo) {
        return usuarioToken.tipo
    }

    const cookies = parseCookies(req?.headers?.cookie || "");
    if (cookies.tipo) {
        return cookies.tipo;
    }

    return req?.body?.tipo || req?.headers?.tipo || req?.headers?.["x-user-type"];
};

export const verificarAdm = (req, res, next) => {
    const tipo = obterTipoUsuario(req);

    if (tipo === "adm") {
        req.usuario = { tipo };
>>>>>>> e321493 (Arrumando)
        return next();
    }

    return res.status(403).json({
        mensagem: "Acesso permitido apenas para administradores."
    });
};

export const verificarFuncionario = (req, res, next) => {
<<<<<<< HEAD
    if (
        req.body.tipo === "adm" ||
        req.body.tipo === "funcionario"
    ) {
=======
    const tipo = obterTipoUsuario(req);

    if (tipo === "adm" || tipo === "funcionario") {
        req.usuario = { tipo };
>>>>>>> e321493 (Arrumando)
        return next();
    }

    return res.status(403).json({
<<<<<<< HEAD
        mensagem: "Acesso negado."
=======
        mensagem: "Acesso permitido apenas para funcionários ou administradores."
>>>>>>> e321493 (Arrumando)
    });
};