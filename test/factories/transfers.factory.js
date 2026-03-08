
const transferPayload = (overrides = {}) => {
    return {
        contaOrigem: 1,
        contaDestino: 2,
        valor: 2500,
        ...overrides
    };
};

module.exports = {
    transferPayload
};