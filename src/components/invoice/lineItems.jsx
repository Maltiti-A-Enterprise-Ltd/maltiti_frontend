import "./lineItems.css";
import { LineItem } from "./lineItem";

export const LineItems = ({ carts }) => {
  return (
    <form>
      <div className="lineItems">
        <div className="gridTable">
          <div className="row header">
            <div>#</div>
            <div>Item</div>
            {/*<div>Description</div>*/}
            <div>Qty</div>
            <div>Price (GH&#8373;)</div>
            <div>Total (GH&#8373;)</div>
            {/*<div></div>*/}
          </div>
          {/*<DragDropContext onDragEnd={this.handleDragEnd}>*/}
          {/*  <Droppable droppableId="droppable">*/}
          {/*{(provided, snapshot) => (*/}
          <div>
            {carts?.map((cart, i) => (
              <div key={i}>
                <LineItem cart={cart} index={i} />
              </div>
            ))}
            {/*</Draggable>*/}
            {/*))}*/}
            {/*{provided.placeholder}*/}
          </div>
          {/*</Droppable>*/}
          {/*</DragDropContext>*/}
        </div>

        {/*<div className={styles.addItem}>*/}
        {/*  <button type="button" onClick={addHandler}>*/}
        {/*    <AddIcon size="1.25em" className={styles.addIcon} /> Add Item*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </form>
  );
};
