*** Settings ***
Library             RequestsLibrary
Library             ../../../../lib/json_validate_schema.py
Resource            ../../../../data/variables/imports.resource

Test Template       Users Data Sample


*** Test Cases ***    username    password
TC-001 Verify Login User 001    admin    1234
TC-002 Verify Login User 002    admin01    1234
TC-003 Verify Login User 003    admin02    1234
TC-004 Verify Login User 004    admin03    1234



*** Keywords ***
Users Data Sample
    [Arguments]    ${username}    ${password}
    Log To Console    \nRequest To ${GLOBAL_ENDPOINT_LOGIN}\n
    &{jsonBody}    Create Dictionary    username=${username}    password=${password}
    ${response}    POST    url=${GLOBAL_ENDPOINT_LOGIN}    json=&{jsonBody}    expected_status=200
    Validate Json Schema    input_json=${response}    reference_schema_path=${GLOBAL_SCHEMA_LOGIN}
