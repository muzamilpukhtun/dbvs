/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pdc_blockchain_part.json`.
 */
export type PdcBlockchainPart = {
  "address": "D8HmzgTCpv8DhnFegGSG3ZHD1NfH5gZUhpEeEDE9a487",
  "metadata": {
    "name": "pdcBlockchainPart",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "castVote",
      "discriminator": [
        20,
        212,
        15,
        189,
        69,
        180,
        69,
        151
      ],
      "accounts": [
        {
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
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
      "args": [
        {
          "name": "pollId",
          "type": "string"
        },
        {
          "name": "option",
          "type": "string"
        },
        {
          "name": "voterId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "voteAccount",
      "discriminator": [
        203,
        238,
        154,
        106,
        200,
        131,
        0,
        41
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyVoted",
      "msg": "Voter has already voted in this poll."
    }
  ],
  "types": [
    {
      "name": "vote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "string"
          },
          {
            "name": "option",
            "type": "string"
          },
          {
            "name": "voterId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "voteAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "votes",
            "type": {
              "vec": {
                "defined": {
                  "name": "vote"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
