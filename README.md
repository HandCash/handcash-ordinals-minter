# HandCash Items Example Project

## Getting started
This project demo's examples of how to create and manage items for your Handcash Application.  You may want to take different pieces and scripts of this repo and add them directly into your game logic.


### Install dependencies

```bash
npm install
```

### Set up project variables

Paste your credentials in the `.env` file:
```
HANDCASH_APP_ID=<your-app-id>
HANDCASH_APP_SECRET=<your-app-secret>
HANDCASH_AUTH_TOKEN=<your-business-wallet-auth-token>

```

## Create a collection

```javascript
import dotenv from 'dotenv';
import { HandCashMinter, Environments, Types, HandCashConnect } from '@handcash/handcash-connect';

dotenv.config();

const handCashMinter = HandCashMinter.fromAppCredentials({
  appId: process.env.HANDCASH_APP_ID,
  authToken: process.env.HANDCASH_AUTH_TOKEN,
});

(async () => {
  const creationOrderResult = await handCashMinter.createCollection({
    items: [{
      name: 'HandCash Team Caricatures',
      description: 'A unique collection of caricatures of the HandCash team',
      mediaDetails: {
        image: {
          url: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685141160/round-handcash-logo_cj47fp_xnteyo_oy3nbd.png',
          contentType: 'image/png'
        }
      }
    }],
    itemCreationOrderType: 'collection'
  });

  console.log(`Collection Created, collectionId: ${creationOrderResult.items[0].id}`);
})();
```

### Expected Output

After running the script, you should see the following output in the console:

> Collection Created, collectionId: 6578857e01a833fb337aaa3b


## Create Items
You will need a collection id to add the items to `6578857e01a833fb337aaa3b`


```javascript
import dotenv from 'dotenv';
import { HandCashMinter } from '@handcash/handcash-connect';

dotenv.config();

const handCashMinter = HandCashMinter.fromAppCredentials({
  appId: process.env.HANDCASH_APP_ID,
  authToken: process.env.HANDCASH_AUTH_TOKEN,
});

(async () => {

  const collectionId = "657762fc2acbecc109d8c1fb";

  const creationOrderResult = await handCashMinter.createItems({
    items: [
      {
        name: "Rafa",
        user: "612cba70e108780b4f6817ad",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "1", displayType: "string" },
          { name: "Country", value: "Spain", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398977/items/jyn2qqyqyepqhqi9p661.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/zq0lupxoj8id1uedgz2h.png",
            contentType: "image/webp"
          }
        },
        color: "#bf9078",
        quantity: 3
      },
      {
        name: "Alex",
        user: "6213a44bf2936f711c8d19d3",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "1", displayType: "string" },
          { name: "Country", value: "Andorra", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398906/items/da2qv0oqma0hs3gqevg7.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/gh7tsn11svhx7z943znv.png",
            contentType: "image/webp"
          }
        },
        color: "#73c9ac",
        quantity: 3
      },
      {
        name: "Brandon Bryant",
        rarity: "Mythic",
        attributes: [
          { name: "Edition", value: "Test", displayType: "string" },
          { name: "Generation", value: "2", displayType: "string" },
          { name: "Country", value: "United States", displayType: "string" }
        ],
        mediaDetails: {
          image: {
            url: "https://res.cloudinary.com/handcash-iae/image/upload/v1702398906/items/da2qv0oqma0hs3gqevg7.webp",
            imageHighResUrl: "https://res.cloudinary.com/handcash-iae/image/upload/v1697465892/items/edaoeseq43yqdbqwjzn4.png",
            contentType: "image/webp"
          }
        },
        color: "#adeaf5",
        quantity: 1
      }
    ],
    itemCreationOrderType: 'collectionItem'
  });

  console.log(`Items Minted: ${creationOrderResult.items.length}`);
})();

```

In this example 7 items in total are created. 3 "Rafa's" are created to the user with id `612cba70e108780b4f6817ad` , 3 "Alex's" are created to the user with id `6213a44bf2936f711c8d19d3` and 1 "Brandon Bryant" is created to the applications business wallet because no user was specified.  

## Get Inventory 
`HANDCASH_AUTH_TOKEN` can be the business wallet auth token or any user auth token that has connected to your application. 

```javascript
import dotenv from 'dotenv';
import { HandCashConnect} from "@handcash/handcash-connect";

dotenv.config();

const handcashAccount = new HandCashConnect({
    appId: process.env.HANDCASH_APP_ID
    appSecret: process.env.HANDCASH_APP_SECRET
}).getAccountFromAuthToken(process.env.HANDCASH_AUTH_TOKEN);

(async () => {
 const filters = {
        collectionId: "657762fc2acbecc109d8c1fb",
        searchString: "Brandon Bryant",
        from: 0,
        to: 50,
        fetchAttributes: false,
        sort: "createdAt",
        order: "asc"
    };
    const items = await handcashAccount.items.getItemsInventory(filters);
    console.log(items);
})(); 
```

### Filters
- **from**: An integer specifying the starting index for items to fetch. Default is 0.
- **to**: An integer specifying the ending index for items to fetch. Default is 20. Must be greater than 'from' and less than 'from + 501'.
- **collectionId**: A unique identifier for the collection to fetch items from.
- **searchString**: A string to search within item names, descriptions, etc.
- **fetchAttributes**: A boolean to decide whether to fetch attributes of items. Default is true.
- **attributes**: A filter to specify certain item attributes.
- **appId**: The application ID, used to filter items associated with a specific app.

### Sorters
- **sort**: A string specifying the field to sort by. Possible values are `["name"]`
- **order**: A string specifying the sorting order, either 'asc' (ascending) or 'desc' (descending). This filter is required if 'sort' is used.


## TransferItem

```javascript
import dotenv from 'dotenv';
import { HandCashConnect} from "@handcash/handcash-connect";

dotenv.config();

const handcashAccount = new HandCashConnect({
    appId: process.env.HANDCASH_APP_ID
    appId: process.env.HANDCASH_APP_SECRET
}).getAccountFromAuthToken(process.env.HANDCASH_AUTH_TOKEN);

(async () => {
 const filters = {
        collectionId: "657762fc2acbecc109d8c1fb",
        searchString: "Brandon Bryant",
        from: 0,
        to: 1,
    };
    const receiverUserId = "612cba70e108780b4f6817ad";
    const items = await handcashAccount.items.getItemsInventory(filters);
    const result = await account.items.transfer({
        destinationsWithOrigins: [
            {
              destination: receiverUserId,
              origins: [items[0].origin]
            }
        ]
    })
    console.log(`- ✅ Item transferred to ${destination}!`);
})(); 
```
