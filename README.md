
# api-bq-logger

Log each & every api request ,response and error in BigQuery.

[![npm](https://img.shields.io/npm/v/api-bq-logger.svg)](https://www.npmjs.com/package/api-bq-logger)

## Table of Contents

* [Install](#install)
* [Before using api-bq-logger](#before-using-api-bq-logger)
* [Create a Dataset](#create-a-dataset)
* [Create a Table in dataset](#create-a-table-in-dataset)
* [How to use](#how-to-use)
* [Helpdesk](#helpdesk)
* [License](#license)

## Install

#### npm

The best way to install and use api-bq-logger is with npm. It's registered
as [api-bq-logger](https://www.npmjs.com/package/api-bq-logger).

```
$ npm install api-bq-logger
```

#### Manual download

You can manually download api-bq-logger
from [Releases](https://github.com/saurabh-pk/api-bq-logger/releases).

#### From sources

If you want to use the development version of the plugin, use from source
manually. The development version may be unstable.

```
$ git clone https://github.com/saurabh-pk/api-bq-logger.git
$ cd api-bq-logger
$ npm install
```

## Before using api-bq-logger

1.  Select or create a Cloud Platform project.
    [Go to the projects page][projects]

1.  Make sure that billing is enabled for your project.
    [Enable billing][billing]

1.  BigQuery is automatically enabled in new projects.To activate BigQuery in a pre-existing project, go to Enable the BigQuery API.
    [Enable the API][enable_api]

1. To get authentication key file with a service account so you can access the API.
    1. Go to the **Create service account key** page in the [GCP Console](https://console.cloud.google.com/apis/credentials/serviceaccountkey).
     1.  From the  **Service account**  drop-down list, select  **New service account**.
     2.  Enter a name into the  **Service account name**  field.
     3. From the **Role** drop-down list, select **Project** > **Owner**.
     4.  Click  **Create**. A JSON file that contains your key downloads to your computer. Save this file in your projects base_dir.

[projects]:https://console.cloud.google.com/cloud-resource-manager
[billing]: https://cloud.google.com/billing/docs/how-to/modify-project
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=bigquery-json.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started

    

## Create a Dataset

1. Go to the [BigQuery web UI](https://bigquery.cloud.google.com/)
1. Click the down arrow icon ![V](https://cloud.google.com/bigquery/images/icon-down-arrow.png) down arrow icon next to your project name in the navigation, then click **Create new dataset**.
1. Input the *DatasetName* for the **Dataset ID**.
1. Leave all of the other default settings in place and click **OK**.

## Create a Table in dataset

1. In the navigation, hover on the Dataset ID that you just created.
1. Click the down arrow icon down arrow icon ![V](https://cloud.google.com/bigquery/images/icon-down-arrow.png) next to the Dataset ID and click **Create new table**. Use the default values for all settings unless otherwise indicated.
1. Under Destination Table, enter the *TableName* for the **destination table name**.
1. In the Schema section, click the **Edit as Text** link. Then replace the contents of the Schema input area with the following schema:
```
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
```
**OR**

You can add schema manually using following schema details.
```
 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
|                                |               |               |
|    Column Name                 |   Type        |   Mode        |
|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | _ _ _ _ _ _ _ | _ _ _ _ _ _ _ |
|    request_id                  |   STRING      |   NULLABLE    |
|    requested_api_url           |   STRING      |   NULLABLE    |
|    requesting_hostname         |   STRING      |   NULLABLE    |
|    requesting_ip		 |   STRING      |   NULLABLE    |
|    request_method		 |   STRING      |   NULLABLE    |
|    request_url                 |   STRING      |   NULLABLE    |
|    request_from_user_agent	 |   STRING      |   NULLABLE    |
|    request_referer             |   STRING      |   NULLABLE    |
|    request_params		 |   STRING      |   NULLABLE    |
|    request_query		 |   STRING      |   NULLABLE    |
|    request_body		 |   STRING      |   NULLABLE    |
|    request_accessToken         |   STRING      |   NULLABLE    |
|    request_args		 |   STRING      |   NULLABLE    |
|    request_headers		 |   STRING      |   NULLABLE    |
|    processing_time		 |   STRING      |   NULLABLE    |
|    action_type                 |   STRING      |   NULLABLE    |
|    action_details		 |   STRING      |   NULLABLE    |
|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | _ _ _ _ _ _ _ | _ _ _ _ _ _ _ |
```

5. Click the **Create Table** button.

For more details visit,
[BigQuery Web UI](https://cloud.google.com/bigquery/bigquery-web-ui)

## How to use
  
1. Add following code in server/server.js after boot script.

```    
var apiBQLogger = require("api-bq- logger").factory(app,'KeyFileName','DatasetName','TableName',showlog);
```
where,
* **app** is an object of loopback
* **KeyFileName** name of the Google Cloud Bigquery service key file saved in base directory.
 * **DatasetName** Name of the dataset used to create logs table.
 * **TableName** Name of the table name which is use to save logs.
 * **showlog** Shows logs in console if set **true**, default is **false**

## Helpdesk

If you have any idea to improve this project or any problem using this, please
feel free to upload an [issue](https://github.com/saurabh-pk/api-bq-logger/issues).

The project is not actively maintained. No maintainer is paid, and most of
us are busy on our professional or personal works. Please understand that it may
take a while for an issue to be resolved.

## License

[GPL-3.0](LICENSE)
