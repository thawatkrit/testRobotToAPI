*** Settings ***
Resource    ../../../../data/variables/imports.resource
Resource    ../../../../keywords/imports.resource
Resource    ../../../../keywords/setupTeardowns.robot

Suite Setup    Authorize
Test Template  Custom Test Template

*** Test Cases ***                                        CONTRACTS
TC004 Verify Create User With 0 Contracts Is Not Working        ${0}

TC005 Verify Create User With 4 Contracts Is Not Working        ${4}

*** Keywords ***
Custom Test Template
    [Arguments]  ${numberOfContracts}
    Log To Console    \nSending Request To ${GLOBAL_ENDPOINT_USERS}\n
    ${id}  ${response}  Create New User  numberOfContracts=${numberOfContracts}  expectedStatuscode=400
    Validate Schema    inputJson=${response.json()}    referenceSchemaPath=${GLOBAL_SCHEMA_ERROR_CONTRACTS}
    