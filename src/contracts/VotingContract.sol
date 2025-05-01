
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        address creator;
        bool active;
    }
    
    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
    }
    
    // Mappings
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256) public candidateCount;
    
    uint256 public electionCount;
    
    // Events
    event ElectionCreated(uint256 electionId, string title, address creator);
    event CandidateAdded(uint256 electionId, uint256 candidateId, string name);
    event VoteCast(uint256 electionId, uint256 candidateId, address voter);
    
    // Create a new election
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        string[] memory candidateNames,
        string[] memory candidateDescriptions
    ) public {
        require(_startTime < _endTime, "End time must be after start time");
        require(candidateNames.length > 1, "Need at least two candidates");
        require(candidateNames.length == candidateDescriptions.length, "Candidate info mismatch");
        
        uint256 electionId = electionCount++;
        
        elections[electionId] = Election({
            id: electionId,
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            creator: msg.sender,
            active: true
        });
        
        for (uint256 i = 0; i < candidateNames.length; i++) {
            uint256 candidateId = candidateCount[electionId]++;
            candidates[electionId][candidateId] = Candidate({
                id: candidateId,
                name: candidateNames[i],
                description: candidateDescriptions[i],
                voteCount: 0
            });
            
            emit CandidateAdded(electionId, candidateId, candidateNames[i]);
        }
        
        emit ElectionCreated(electionId, _title, msg.sender);
    }
    
    // Cast a vote
    function vote(uint256 _electionId, uint256 _candidateId) public {
        Election memory election = elections[_electionId];
        
        require(election.active, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started yet");
        require(block.timestamp <= election.endTime, "Election has ended");
        require(!hasVoted[_electionId][msg.sender], "You have already voted in this election");
        require(_candidateId < candidateCount[_electionId], "Invalid candidate");
        
        candidates[_electionId][_candidateId].voteCount++;
        hasVoted[_electionId][msg.sender] = true;
        
        emit VoteCast(_electionId, _candidateId, msg.sender);
    }
    
    // End an election early (only by creator)
    function endElection(uint256 _electionId) public {
        require(elections[_electionId].creator == msg.sender, "Only the creator can end the election");
        require(elections[_electionId].active, "Election already ended");
        
        elections[_electionId].active = false;
        elections[_electionId].endTime = block.timestamp;
    }
    
    // Get results for a specific election
    function getElectionResults(uint256 _electionId) public view returns (uint256[] memory, uint256[] memory) {
        uint256 count = candidateCount[_electionId];
        uint256[] memory ids = new uint256[](count);
        uint256[] memory votes = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            ids[i] = candidates[_electionId][i].id;
            votes[i] = candidates[_electionId][i].voteCount;
        }
        
        return (ids, votes);
    }
    
    // Get all elections
    function getElections() public view returns (uint256[] memory) {
        uint256[] memory electionIds = new uint256[](electionCount);
        
        for (uint256 i = 0; i < electionCount; i++) {
            electionIds[i] = i;
        }
        
        return electionIds;
    }
    
    // Check if user has voted
    function hasUserVoted(uint256 _electionId, address _voter) public view returns (bool) {
        return hasVoted[_electionId][_voter];
    }
}
