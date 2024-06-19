class TokensCache {
    constructor() {
        if (!TokensCache.instance) {
            this.tokenList = null;
            TokensCache.instance = this;
        }

        return TokensCache.instance;
    }

    async fetchTokenList() {
        if (this.tokenList) {
            // 如果 tokenList 已经存在，直接返回
            return this.tokenList;
        }

        try {
            const response = await fetch('/tokens/token_list.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            this.tokenList = data.tokens;
        } catch (error) {
            console.error('Error fetching the token list:', error);
        }

        return this.tokenList;
    }

    async getTokenList() {
        if (!this.tokenList) {
            await this.fetchTokenList();
        }
        return this.tokenList;
    }

    async getToken(symbol) {
        if (!this.tokenList) {
            await this.fetchTokenList();
        }

        if (symbol?.length > 0) {
            const tokenInfo = this.tokenList.find(
                token => token.symbol.toLowerCase() === symbol.toLowerCase()
            );

            return tokenInfo;
        }

        return null;
    }
}

// 单例模式实现
const tokensCache = new TokensCache();

export default tokensCache;
