*** Settings ***
Resource    ../../../../data/variables/imports.resource
Resource    ../../../../keywords/imports.resource
Resource    ../../../../keywords/setupTeardowns.robot

Suite Setup    Authorize

*** Test Cases ***

Verify All Users
    Log To Console    \nSending Request To ${GLOBAL_ENDPOINT_USERS}\n
    ${params}    Create Dictionary    filter=all
    ${respone}    GET    url=${GLOBAL_ENDPOINT_USERS}    expected_status=200
    ... headers=${GLOBAL_AUTH_HEADER} params=${params}
    Validate Schema    inputJson=${respone.json()}   referenceSchemaPath=${GLOBAL_ENDPOINT_USERS}
