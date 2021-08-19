import boto3
s3_client = boto3.client("s3)"

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('KordiaSiteSampleData')

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    s3_file_name = event['Records'][0]['s3']['object']['key']
    resp = s3_client.get_object(Bucket=bucket_name,Key=s3_file_name)
    data = resp['Body'].read().decode("utf-8")
    KordiaSiteSampleData = data.split("\n")
    for site in KordiaSiteSampleData
    print(site)
    # Add it to dynamodb
    table.put_item(
        Item = {
            "id" : site_data[0]
            "name" : site_data[1]
            "area" : site_data[2]
            "coordinates" : site_data[3]
        }
        )
        except Exception as e:
            print("End of file")
    