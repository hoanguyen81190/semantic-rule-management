# semantic-rule-management
Semantic rule management is a supporting tool for the Autonomic Orchestration core system in the Arrowhead framework. The tool allows visualization of semantic representation of the local cloud.
The tool works together with [Autonomic Orchestration](https://github.com/anlam/AutonomicOrchestration/tree/java-spring-version), as a standalone tool, the tool can visualize different ontology schemas. 
## I. Install
1. Certificates  
The folder "semantic_rule_management/certificates" contains all certificates needed for a local cloud, including Autonomic Orchestration and demo clients. Copy semantic_rule_management.p12, semantic_rule_management.pub, truststore.p12 into "semantic_rule_management/server/system/certificates"  
2. Dependencies  
Run "npm install" in "semantic_rule_management/server/system" and "semantic_rule_management/server/client"

## II. Communication with Autonomic Orchestration
The tool consumes 6 services from Autonomic Orchestration
- "auto-orchestration-get-all-consumers"
- "auto-orchestration-get-all-rules"
- "auto-orchestration-get-all-queries"
- "auto-orchestration-get-knowledge"
- "auto-orchestration-register"
- "auto-orchestration-delete"

## III. Start
Run "start.bat" in "semantic_rule_management/server/system"
