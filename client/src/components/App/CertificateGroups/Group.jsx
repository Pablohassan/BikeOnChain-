import { Badge, Button, Text } from "@nextui-org/react";
import PropTypes from "prop-types";
import NftCard from "../../common/NftCard";

function Group({ id, amount, template, setTransferModal }) {
  return (
    <div 
      style={{
       
        margin:10,
        background: "whitesmoke",
        padding: 10,
        paddingTop: 10,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        height: 420,
        minWidth:320
      }}
      title={template.description}
    > 
        <div>  <Text h3 size="$lg"> Numéro de la collection : {id}</Text></div>
      <div
        style={{
          display: "flex",
          flexDirection:"column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            margin: "10px 0",
          }}
        >
          <Badge isSquared enableShadow disableOutline color="success" size="xs" placement="top-right">
          <Text weight="bold" color="white">
          {amount} vélos en stock
          </Text>
          </Badge>
        

        
        </div>
        
       
      </div>
      
      <NftCard
        {...template}
        isPressable={false}
        showStatus={false}
        css={{ flex: 1, pb:10 }}

      />
       <Button

       css={{margin:"10px"}}
        auto ghost
        rounded
       
          size="md"
          color="secondary"
          onClick={() => setTransferModal({ groupId: id })}
        >
          <Text color="secondary"  weight="bold"> Transférer vers revendeur</Text>
        
        </Button>
    </div>
  );
}

Group.propTypes = {
  id: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  template: PropTypes.array.isRequired,
  setTransferModal: PropTypes.func.isRequired,
};

export default Group;
