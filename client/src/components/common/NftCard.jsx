import { Badge, Card, Text } from "@nextui-org/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { statusToColor, statusToString } from "../../utils/bike";

function NftCard({
  BikeId,
  collectionAddr,
  brand,
  image,
  buildYear,
  status,
  isPressable = true,
  showStatus = true,
  css,
}) {
  const navigate = useNavigate();

  return (
    <Card
      isPressable={isPressable}
      css={{
        height: 400,
        ...css,
      }}
      onClick={
        collectionAddr ? () => navigate(`/${collectionAddr}/${BikeId}`) : null
      }
    >
      <Card.Body
        css={{
          p: 0,
          flexDirection: "row",
        }}
      >
        <Card.Image src={image} alt={brand} />
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          {showStatus && (
            <Badge color={statusToColor(Number(status))}>
              {statusToString(Number(status))}
            </Badge>
          )}
        </div>
      </Card.Body>
      <Card.Footer
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Text b>{brand}</Text>
        <Text
          css={{
            color: "$accents7",
            fontWeight: "$semibold",
            fontSize: "$sm",
          }}
        >
          {buildYear}
        </Text>
      </Card.Footer>
    </Card>
  );
}

NftCard.propTypes = {
  BikeId: PropTypes.string.isRequired,
  collectionAddr: PropTypes.string,
  brand: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  buildYear: PropTypes.string.isRequired,
  isPressable: PropTypes.bool,
  showStatus: PropTypes.bool,
  css: PropTypes.object,
};

export default NftCard;
