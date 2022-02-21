function decodeUplink(input) {
  return {
    data: {
      button_value: text2nr(String.fromCharCode(input.bytes)),
      bytes: String.fromCharCode(input.bytes)
    },
    warnings: [],
    errors: []
  };
}

function text2nr(text) {
  switch(text) {
    case "A":
      return 1;
    case "B":
      return 2;
    case "C":
      return 3;
    case "D":
      return 4;
    default: 
      return 0;
  }
}
