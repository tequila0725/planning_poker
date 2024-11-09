// 定数
export const CARD_VALUES = [1, 2, 3, 5, 8, 13, 21, "?"];

export const ROUNDING_METHODS = {
  standard: {
    name: "一般的な四捨五入",
    function: (num: number) => Math.round(num),
  },
  bankers: {
    name: "銀行型四捨五入",
    function: (num: number) => {
      const decimal = num - Math.floor(num);
      if (decimal === 0.5) {
        return Math.floor(num) % 2 === 0 ? Math.floor(num) : Math.ceil(num);
      }
      return Math.round(num);
    },
  },
  roundUp: {
    name: "切り上げ型四捨五入",
    function: (num: number) => Math.ceil(num * 2) / 2,
  },
  roundDown: {
    name: "切り捨て型四捨五入",
    function: (num: number) => Math.floor(num * 2) / 2,
  },
  ceil: {
    name: "天井関数",
    function: (num: number) => Math.ceil(num),
  },
  floor: {
    name: "床関数",
    function: (num: number) => Math.floor(num),
  },
};
