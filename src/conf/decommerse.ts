/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/decommerse.json`.
 */
export type Decommerse = {
  "address": "Fyv3yoqLqFmMbhyFy8XcSrx1n6EzXecGQG58g5WKxFz2",
  "metadata": {
    "name": "decommerse",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createProduct",
      "discriminator": [
        183,
        155,
        202,
        119,
        43,
        114,
        174,
        225
      ],
      "accounts": [
        {
          "name": "product",
          "writable": true
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "metadata",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "initialStock",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createUserProfile",
      "discriminator": [
        9,
        214,
        142,
        184,
        153,
        65,
        50,
        174
      ],
      "accounts": [
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "pCount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "purchaseProduct",
      "discriminator": [
        170,
        147,
        27,
        79,
        79,
        116,
        159,
        219
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "product.seller",
                "account": "product"
              },
              {
                "kind": "account",
                "path": "program_state.product_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "transaction",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pid",
          "type": "u64"
        },
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateProductStock",
      "discriminator": [
        118,
        196,
        18,
        176,
        42,
        141,
        247,
        91
      ],
      "accounts": [
        {
          "name": "product",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "account",
                "path": "program_state.product_count",
                "account": "programState"
              }
            ]
          }
        },
        {
          "name": "programState",
          "writable": true
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newStock",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "product",
      "discriminator": [
        102,
        76,
        55,
        251,
        38,
        73,
        224,
        229
      ]
    },
    {
      "name": "programState",
      "discriminator": [
        77,
        209,
        137,
        229,
        149,
        67,
        167,
        230
      ]
    },
    {
      "name": "transaction",
      "discriminator": [
        11,
        24,
        174,
        129,
        203,
        117,
        242,
        23
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "usernameTooLong",
      "msg": "Username exceeds maximum length"
    },
    {
      "code": 6001,
      "name": "productNotFound",
      "msg": "product not found"
    },
    {
      "code": 6002,
      "name": "programAlreadyInitialzed",
      "msg": "Program already intialized"
    },
    {
      "code": 6003,
      "name": "productIdTooLong",
      "msg": "Product ID exceeds maximum length"
    },
    {
      "code": 6004,
      "name": "productNameTooLong",
      "msg": "Product name exceeds maximum length"
    },
    {
      "code": 6005,
      "name": "profileAlreadyInitialized",
      "msg": "Profile already intialized"
    },
    {
      "code": 6006,
      "name": "invalidPrice",
      "msg": "Price must be greater than zero"
    },
    {
      "code": 6007,
      "name": "invalidStock",
      "msg": "Stock must be greater than zero"
    },
    {
      "code": 6008,
      "name": "invalidQuantity",
      "msg": "Invalid quantity"
    },
    {
      "code": 6009,
      "name": "insufficientStock",
      "msg": "Insufficient stock for purchase"
    },
    {
      "code": 6010,
      "name": "priceOverflow",
      "msg": "Price calculation overflow"
    },
    {
      "code": 6011,
      "name": "stockUnderflow",
      "msg": "Stock calculation underflow"
    },
    {
      "code": 6012,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    }
  ],
  "types": [
    {
      "name": "product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "productId",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "metadata",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "stock",
            "type": "u64"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "transactionCount",
            "type": "u64"
          },
          {
            "name": "productCount",
            "type": "u64"
          },
          {
            "name": "initialized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "transaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pid",
            "type": "u64"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "seller",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "productsCount",
            "type": "u64"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
