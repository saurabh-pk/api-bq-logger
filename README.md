# api-bq-logger

Follow the steps

Before you begin

1) Select or create a GCP project.(https://console.cloud.google.com/cloud-resource-manager")
2) Make sure that billing is enabled for your project.(https://cloud.google.com/billing/docs/how-to/modify-project)
3) BigQuery is automatically enabled in new projects.To activate BigQuery in a pre-existing project, go to Enable the BigQuery API.(https://console.cloud.google.com/flows/enableapi?apiid=bigquery)

Create a dataset

1) Go to the BigQuery web UI.(https://bigquery.cloud.google.com/)
2) Click the down arrow icon down arrow icon next to your project name in the navigation, then click "Create new dataset".
3) Input the DatasetName for the "dataset ID".
4) Leave all of the other default settings in place and click "OK".

Create a Table in dataset

1) In the navigation, hover on the dataset ID that you just created.
2) Click the down arrow icon down arrow icon next to the ID and click "Create new table".Use the default values for all settings unless otherwise indicated.
3) Under Destination Table, enter the TableName for the "destination table name".
4) In the Schema section, click the "Edit as Text" link. Then replace the contents of the Schema input area with the following schema:

        request_id: STRING,
        requested_api_url: STRING,
        requesting_hostname: STRING,
        requesting_ip:STRING,
        request_method:STRING,
        request_url:STRING,
        request_from_user_agent:STRING,
        request_referer:STRING,
        request_params:STRING,
        request_query:STRING,
        request_body:STRING,
        request_accessToken:STRING,
        request_args:STRING,
        request_headers:STRING,
        processing_time:STRING,
        action_type:STRING,
        action_details:STRING

            OR 
    you can add schema manually using following schema details.
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
       |                                |               |               |
       |    Column Name                 |   Type        |   Mode        |
       |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | _ _ _ _ _ _ _ | _ _ _ _ _ _ _ |
       |    request_id                  |   STRING      |   NULLABLE    |
       |    requested_api_url           |   STRING      |   NULLABLE    |
       |    requesting_hostname         |   STRING      |   NULLABLE    |
       |    requesting_ip		|   STRING      |   NULLABLE    |
       |    request_method		|   STRING      |   NULLABLE    |
       |    request_url                 |   STRING      |   NULLABLE    |
       |    request_from_user_agent	|   STRING      |   NULLABLE    |
       |    request_referer             |   STRING      |   NULLABLE    |
       |    request_params		|   STRING      |   NULLABLE    |
       |    request_query		|   STRING      |   NULLABLE    |
       |    request_body		|   STRING      |   NULLABLE    |
       |    request_accessToken         |   STRING      |   NULLABLE    |
       |    request_args		|   STRING      |   NULLABLE    |
       |    request_headers		|   STRING      |   NULLABLE    |
       |    processing_time		|   STRING      |   NULLABLE    |
       |    action_type                 |   STRING      |   NULLABLE    |
       |    action_details		|   STRING      |   NULLABLE    |
       |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | _ _ _ _ _ _ _ | _ _ _ _ _ _ _ |

5) Click the Create Table button.

How to use package

1) Add following code in server.js after boot script.

    var apiBQLogger = require("api-bq-logger").factory(app,'KeyFileName','DatasetName','TableName',showlog);

    where,
    * "app" is an object of loopback
    * "KeyFileName" name of the Google Cloud Bigquery service key file saved in base directory.
    * "DatasetName" Name of the dataset used to create logs table.
    * "TableName" Name of the table name which is use to save logs.
    * "showlog" (true/false) Shows logs in console if set "true" (default "false")

