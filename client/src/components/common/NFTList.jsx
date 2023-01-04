import { Grid } from "@nextui-org/react";
import PropTypes from "prop-types";
import NftCard from "./NftCard";

function NFTList({ list }) {
  // Attention en cas de modification du nomage dans le contract de la struct bike, ne pas oublier de mettrea jour ici le nom de l id
  return (
    <Grid.Container gap={2} justify="flex-start">
      {list.map((item, index) => (
        <Grid xs={3} key={index}>
          
          <NftCard key={item.BikeId} {...item} />
        </Grid>
      ))}
    </Grid.Container>
  );
}

NFTList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape(NftCard.propTypes)).isRequired,
};

export default NFTList;
