export const verificarAdm = (req, res, next) => {
    if (req.body.tipo === "adm") {
        return next();
    }

    return res.status(403).json({
        mensagem: "Acesso permitido apenas para administradores."
    });
};

export const verificarFuncionario = (req, res, next) => {
    if (
        req.body.tipo === "adm" ||
        req.body.tipo === "funcionario"
    ) {
        return next();
    }

    return res.status(403).json({
        mensagem: "Acesso negado."
    });
};