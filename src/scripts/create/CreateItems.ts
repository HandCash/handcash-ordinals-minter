import {ComponentsFactory} from "../../ComponentsFactory.js";
import {Argument, Command} from "commander";
const handCashMinter = ComponentsFactory.getHandCashMinter();
const ItemsLoader = ComponentsFactory.getItemsLoader();
const ImageService = ComponentsFactory.getImageService();

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

async function main() {
    const [collectionId] = new Command()
      .addArgument(new Argument('<collectionId>', 'The id of the collection where the items will be minted'))
      .parse(process.argv)
      .args;
  
    let itemsToCreate = await ItemsLoader.loadItems();
    itemsToCreate = await ItemsLoader.uploadItemImages(ImageService, itemsToCreate);
    
    let creationOrder = await handCashMinter.createItemsOrder({ collectionId, items: itemsToCreate});
    // wait for collection to be created in the background
    let counter = 10;
    while(creationOrder.status !== 'completed' && counter-- > 0) {
        await sleep(3000);
        creationOrder = await handCashMinter.getOrder(creationOrder.id);
    }

    const items = await handCashMinter.getOrderItems(creationOrder.id);
    console.log(`Items Created`, items)
  }
  

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();


