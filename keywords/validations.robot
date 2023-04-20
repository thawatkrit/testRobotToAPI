*** Settings ***
Library    ../lib/json_validate_schema.py

*** Keywords ***
Validate Schema
    [Arguments]    ${inputJson}  ${referenceSchemaPath}
    Log To Console    Validating the JSON Schema!
    Validate Json Schema    ${inputJson}  ${referenceSchemaPath}