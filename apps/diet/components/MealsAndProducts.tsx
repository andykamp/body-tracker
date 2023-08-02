import { Tabs, useTabs } from "@geist-ui/core";
import Meals from "./Meals";
import Products from "./Products";

function MealsAndProductsPage() {

  const {  bindings } = useTabs('1')

  return (
    <div>
      <Tabs {...bindings}>

        <Tabs.Item label="Products" value="1">
          <Products />
        </Tabs.Item>

        <Tabs.Item label="Meals" value="2">
          <Meals/>
        </Tabs.Item>

      </Tabs>
    </div >
  )
}

export default MealsAndProductsPage;

