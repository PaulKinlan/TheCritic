// See https://github.com/GoogleChromeLabs/comlink/issues/435
import { transferHandlers, proxy } from 'comlink';
const proxyTransferHandler = transferHandlers.get('proxy');
export const asyncGeneratorTransferHandler = {
    canHandle: (value) => value && typeof value.next === 'function' && typeof value[Symbol.asyncIterator] === 'function',
    async *deserialize(obj) {
        const iterator = proxyTransferHandler.deserialize(obj);
        for (;;) {
            const { value, done } = await iterator.next();
            if (done) {
                break;
            }
            else {
                yield value;
            }
        }
    },
    serialize(obj) {
        return proxyTransferHandler.serialize(proxy(obj));
    },
};
transferHandlers.set('asyncGenerator', asyncGeneratorTransferHandler);
//# sourceMappingURL=comlink-async.js.map