// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedCharityFund {
    struct FundingRequest {
        address projectAddress;
        uint256 requestedAmount;
        string projectDescription;
        uint256 voteCount;
        bool finalized;
        bool approved;
    }

    mapping(address => uint256) public votingPower; 
    mapping(uint256 => mapping(address => bool)) public votes; 
    FundingRequest[] public fundingRequests;
    uint256 public totalVotingPower;
    address[] public fundedProjects;
    uint256[] public fundedAmounts;
    string[] public fundedDescriptions;

    constructor() {}


    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than zero");
        votingPower[msg.sender] += msg.value;
        totalVotingPower += msg.value;
    }


    function submitFundingRequest(address projectAddress, uint256 requestedAmount, string memory projectDescription) public {
        fundingRequests.push(FundingRequest({
            projectAddress: projectAddress,
            requestedAmount: requestedAmount,
            projectDescription: projectDescription,
            voteCount: 0,
            finalized: false,
            approved: false
        }));
    }

  
    function voteOnRequest(uint256 requestId) public returns (bool) {
        require(requestId < fundingRequests.length, "Invalid request ID");
        require(votingPower[msg.sender] > 0, "No voting power available"); 
        require(!votes[requestId][msg.sender], "Already voted on this request");

        votes[requestId][msg.sender] = true;
        fundingRequests[requestId].voteCount += votingPower[msg.sender];
        return true;
    }


    function finalizeRequest(uint256 requestId) public returns (bool) {
        require(requestId < fundingRequests.length, "Invalid request ID");
        FundingRequest storage request = fundingRequests[requestId];
        require(!request.finalized, "Request already finalized");

        if (request.voteCount > totalVotingPower / 2) {
            request.approved = true;
            request.finalized = true;
            payable(request.projectAddress).transfer(request.requestedAmount);
            
            fundedProjects.push(request.projectAddress); 
            fundedAmounts.push(request.requestedAmount);
            fundedDescriptions.push(request.projectDescription);
        } else {
            request.finalized = true;
        }

        return request.approved;
    }

    function getFundingHistory() public view returns (address[] memory, uint256[] memory, string[] memory) {
        return (fundedProjects, fundedAmounts, fundedDescriptions);
    }
}
