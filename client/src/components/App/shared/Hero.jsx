import bikesMotif from "../../../assets/images/Monkey.png";
import PropTypes from "prop-types";

function Hero({ children, style }) {
  return (
    <div
      style={{
        color:'white',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor:"transparent",
        padding: "50px 0",
        marginBottom: 15,
        ...style,
      }}
    >
      <div
    
      >
        {children}
      </div>
    </div>
  );
}

Hero.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Hero;
