// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/utils/Base64.sol";

/// @title A collection contract (ERC721) for bikes.
/// @author Samir Kamal
/// @author Rusmir Sadikovic
/// @dev Use Ownable contract from OpenZeppelin
/// @notice Allow to create a collection of bikes.
///         To mint multiple bike at once.
contract BikeCollection is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    ////////////////////////////////////////////////////////////////
    // Enums
    ////////////////////////////////////////////////////////////////
    enum Status {
        Idle,
        OnSale,
        InService,
        OutOfService,
        Stolen,
        Maintenance
    }
    ////////////////////////////////////////////////////////////////
    // Structs
    ////////////////////////////////////////////////////////////////
    struct Bike {
        uint256 id;
        string brand;
        string model;
        string typeOf;
        string color;
        string description;
        string image;
        uint16 buildYear;
        uint256 firstPurchaseDate;
        string serialNumber;
        Status status;
    }

    struct MaintenanceBook {
        string store;
        string commentar;
        uint256 maintenanceDate;
        address mainteneur;
    }
    ////////////////////////////////////////////////////////////////
    // Events
    ////////////////////////////////////////////////////////////////

    event GroupCreated(uint256 indexed id, uint16 amount, Bike template);
    event GroupUpdated(uint256 indexed id, uint256 amount);
    event StolenBike(uint256 indexed id, string stolen);
    event BikeOnSale(uint256 indexed id, string sale, uint256 dateUpForSale);
    event BikeTransferedService(
        uint256 indexed id,
        string indexed serial,
        string status
    );
    event BikeOnService(uint256 indexed id, string status);
    event BikeSold(uint256 indexed id, address indexed _address);
    event AuthorizedMaintenance(address indexed _address, string status);
    event MaintenanceDone(
        uint256 indexed id,
        string store,
        string commentar,
        uint256 maintenanceDate
    );

    ////////////////////////////////////////////////////////////////
    // Modifiers
    ////////////////////////////////////////////////////////////////

    modifier ifTokenExist(uint256 id) {
        require(_exists(id), "Bike doesn't exist");
        _;
    }

    modifier ifTokenApprovedOrOwner(uint256 id) {
        require(
            _isApprovedOrOwner(_msgSender(), id),
            "Caller is not bike owner or approved"
        );
        _;
    }

    modifier ifValidStatus(uint256 tokenId) {
        require(
            _bikeByTokenId[tokenId].status != Status.Idle &&
                _bikeByTokenId[tokenId].status != Status.OnSale &&
                _bikeByTokenId[tokenId].status != Status.Stolen,
            "Not allowed"
        );
        _;
    }

    ////////////////////////////////////////////////////////////////
    // Storage
    ////////////////////////////////////////////////////////////////

    Counters.Counter private _tokenIds;
    Counters.Counter private _groupIds;
    MaintenanceBook[] public maintenance;
    mapping(address => bool) authorizedMaintenance;
    mapping(uint256 => Bike) private _bikeByTokenId;
    mapping(uint256 => uint256[]) private _tokenIdsByGroupId;

    ////////////////////////////////////////////////////////////////
    // Constructor
    ////////////////////////////////////////////////////////////////

    constructor(string memory brand, string memory symbol)
        ERC721(brand, symbol)
    {}

    ////////////////////////////////////////////////////////////////
    // Mint
    ////////////////////////////////////////////////////////////////

    function batchMint(
        uint16 amount,
        string calldata brand,
        string calldata model,
        string calldata typeOf,
        string calldata color,
        string calldata description,
        string calldata image,
        uint16 buildYear
    ) external onlyOwner {
        _groupIds.increment();
        uint256 currentGroupId = _groupIds.current();

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _mintBike(
                brand,
                model,
                typeOf,
                color,
                description,
                image,
                buildYear
            );
            _tokenIdsByGroupId[currentGroupId].push(tokenId);
        }

        emit GroupCreated(
            currentGroupId,
            amount,
            Bike(
                0,
                brand,
                model,
                typeOf,
                color,
                description,
                image,
                buildYear,
                0,
                "",
                Status.Idle
            )
        );
    }

    function _mintBike(
        string calldata brand,
        string calldata model,
        string calldata typeOf,
        string calldata color,
        string calldata description,
        string calldata image,
        uint16 buildYear
    ) private onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender, currentTokenId);
        _bikeByTokenId[currentTokenId] = Bike(
            currentTokenId,
            brand,
            model,
            typeOf,
            color,
            description,
            image,
            buildYear,
            0,
            "",
            Status.Idle
        );

        return currentTokenId;
    }

    ////////////////////////////////////////////////////////////////
    // Transfer
    ////////////////////////////////////////////////////////////////

    function batchTransferForSale(
        address from,
        address to,
        uint256 groupId,
        uint16 amount
    ) external onlyOwner {
        require(
            amount <= _tokenIdsByGroupId[groupId].length,
            "Amount too higher"
        );

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _tokenIdsByGroupId[groupId][
                _tokenIdsByGroupId[groupId].length - 1
            ];
            _tokenIdsByGroupId[groupId].pop();
            _bikeByTokenId[tokenId].status = Status.OnSale;
            safeTransferFrom(from, to, tokenId, "");
        }

        emit GroupUpdated(groupId, _tokenIdsByGroupId[groupId].length);
    }

    function transferForService(
        address from,
        address to,
        uint256 tokenId,
        string calldata serialNumber,
        uint256 firstPurchaseDate
    ) external ifTokenExist(tokenId) ifTokenApprovedOrOwner(tokenId) {
        require(_bikeByTokenId[tokenId].status == Status.OnSale, "Not on sale");
        require(
            keccak256(abi.encode(serialNumber)) != keccak256(abi.encode("")),
            "SN empty"
        );

        _bikeByTokenId[tokenId].firstPurchaseDate = firstPurchaseDate;
        _bikeByTokenId[tokenId].serialNumber = serialNumber;
        _bikeByTokenId[tokenId].status = Status.InService;

        safeTransferFrom(from, to, tokenId, "");
        emit BikeTransferedService(
            tokenId,
            serialNumber,
            _statusToString(_bikeByTokenId[tokenId].status)
        );
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(_bikeByTokenId[tokenId].status != Status.Idle, "Idle mode");
        require(
            _bikeByTokenId[tokenId].status == Status.InService
                ? keccak256(abi.encode(_bikeByTokenId[tokenId].serialNumber)) !=
                    keccak256(abi.encode(""))
                : true,
            "Call transferForService"
        );

        super._transfer(from, to, tokenId);
        emit BikeSold(tokenId, to);
    }

    ////////////////////////////////////////////////////////////////
    // Status
    ////////////////////////////////////////////////////////////////

    function setStolen(uint256 tokenId)
        external
        ifTokenExist(tokenId)
        ifTokenApprovedOrOwner(tokenId)
        ifValidStatus(tokenId)
    {
        _bikeByTokenId[tokenId].status = Status.Stolen;
        emit StolenBike(tokenId, "bike is declared stolen");
    }

    function setInService(uint256 tokenId)
        external
        ifTokenExist(tokenId)
        ifTokenApprovedOrOwner(tokenId)
    {
        require(
            _bikeByTokenId[tokenId].status != Status.Idle,
            "Not allowed, bike on Idle"
        );

        _bikeByTokenId[tokenId].status = Status.InService;
        emit BikeOnService(
            tokenId,
            _statusToString(_bikeByTokenId[tokenId].status)
        );
    }

    function setOnSale(uint256 tokenId, uint256 dateUpForSale)
        external
        ifTokenExist(tokenId)
        ifTokenApprovedOrOwner(tokenId)
        ifValidStatus(tokenId)
    {
        _bikeByTokenId[tokenId].status = Status.OnSale;

        emit BikeOnSale(tokenId, "OnSale", dateUpForSale);
    }

    function setMaintenanceStatus(uint256 tokenId, address maintaddr)
        external
        ifTokenExist(tokenId)
        ifTokenApprovedOrOwner(tokenId)
        ifValidStatus(tokenId)
    {
        _bikeByTokenId[tokenId].status = Status.Maintenance;
        emit AuthorizedMaintenance(
            maintaddr,
            _statusToString(_bikeByTokenId[tokenId].status)
        );
    }

    ////////////////////////////////////////////////////////////////
    // Maintenance
    ////////////////////////////////////////////////////////////////

    function setMaintenance(
        uint256 tokenId,
        string memory _store,
        string memory _commentar,
        uint256 _maintenanceDate,
        address _mainteneur
    ) public ifTokenExist(tokenId) ifValidStatus(tokenId) {
        require(
            _bikeByTokenId[tokenId].status == Status.Maintenance &&
                _mainteneur == msg.sender,
            "Change velo status in Maintenance"
        );

        maintenance.push(
            MaintenanceBook(_store, _commentar, _maintenanceDate, _mainteneur)
        );

        _bikeByTokenId[tokenId].status = Status.InService;
        emit MaintenanceDone(tokenId, _store, _commentar, _maintenanceDate);
    }

    function _statusToString(Status status)
        private
        pure
        returns (string memory)
    {
        if (status == Status.Idle) {
            return "Idle";
        }
        if (status == Status.OnSale) {
            return "On sale";
        }
        if (status == Status.InService) {
            return "In service";
        }
        if (status == Status.OutOfService) {
            return "Out of service";
        }
        if (status == Status.Stolen) {
            return "Stolen";
        }
        if (status == Status.Maintenance) {
            return "On Maintenance";
        }
        return "/";
    }

    ////////////////////////////////////////////////////////////////
    // Getters
    ////////////////////////////////////////////////////////////////

    function getBike(uint256 tokenId)
        external
        view
        ifTokenExist(tokenId)
        returns (Bike memory)
    {
        return _bikeByTokenId[tokenId];
    }

    function getGroupAmount(uint256 groupId) external view returns (uint256) {
        return _tokenIdsByGroupId[groupId].length;
    }

    function getGroupsAmount() external view returns (uint256) {
        return _groupIds.current();
    }

    function getRealisedMaintenance(uint256 tokenId)
        external
        view
        ifTokenExist(tokenId)
        returns (MaintenanceBook[] memory)
    {
        return maintenance;
    }

    ////////////////////////////////////////////////////////////////
    // URI
    ////////////////////////////////////////////////////////////////

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        Bike memory bike = _bikeByTokenId[tokenId];

        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "',
            bike.model,
            " #",
            Strings.toString(tokenId),
            '",',
            '"description": "',
            bike.description,
            '",',
            '"image": "',
            bike.image,
            '",',
            '"status": ',
            Strings.toString(uint8(bike.status)),
            ",",
            '"external_link": "https://bike-on-chain-4fc8m63gx-pablohassan.vercel.app/',
            Strings.toHexString(uint256(uint160(address(this))), 20),
            "/",
            Strings.toString(tokenId),
            '",',
            '"attributes": [',
            "{",
            '"trait_type": "Serial number",',
            '"value": "',
            bike.serialNumber,
            '"',
            "},",
            "{",
            '"trait_type": "Brand",',
            '"value": "',
            bike.brand,
            '"',
            "},",
            "{",
            '"trait_type": "Build year",',
            '"value": "',
            Strings.toString(bike.buildYear),
            '"',
            "},",
            "{",
            '"trait_type": "First purchase date",',
            '"display_type": "date",',
            '"value": ',
            Strings.toString(bike.firstPurchaseDate),
            "},",
            "{",
            '"status": "Status",',
            '"value": "',
            _statusToString(bike.status),
            '"',
            "}",
            "]",
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }
}
