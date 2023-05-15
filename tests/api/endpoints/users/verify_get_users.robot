*** Settings ***
Resource    ../../../../data/variables/imports.resource
Resource    ../../../../keywords/imports.resource
Resource    ../../../../keywords/setupTeardowns.robot

Suite Setup    Authorize

*** Test Cases ***

TC001 Verify All Users
    Log To Console    \nSending Request To ${GLOBAL_ENDPOINT_USERS}\n
    ${response}  GET  url=${GLOBAL_ENDPOINT_USERS}  expected_status=200 
    ...  headers=${GLOBAL_AUTH_HEADER}
    Validate Schema    inputJson=${response.json()}    referenceSchemaPath=${GLOBAL_SCHEMA_USERS}
