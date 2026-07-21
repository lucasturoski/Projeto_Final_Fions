export const verificarAdm = (req, res, next) => {
    const { tipo } = req.body;

    if (tipo !== "adm") {
        return res.status(403).json({
            mensagem: "Acesso permitido apenas para administradores."
        });
    }

    next();
};

export const verificarFuncionario = (req, res, next) => {
    const { tipo } = req.body;

    if (tipo !== "adm" && tipo !== "funcionario") {
        return res.status(403).json({
            mensagem: "Acesso negado."
        });
    }

    next();
};