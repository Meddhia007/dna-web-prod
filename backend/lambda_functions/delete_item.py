import json
import os
import boto3

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('TABLE_NAME', 'WebsiteContent')
    table = dynamodb.Table(table_name)

    if event.get('httpMethod') == 'DELETE':
        try:
            path_parts = [part for part in event.get('path', '').split('/') if part]
            if len(path_parts) != 3 or path_parts[0] != 'items':
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Invalid path format. Expected /items/{item_type}/{item_id}'})
                }

            item_type = path_parts[1].upper()
            item_id = path_parts[2]

            table.delete_item(
                Key={
                    'PK': item_type,
                    'SK': item_id
                }
            )

            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Item deleted successfully'})
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }

    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Invalid request method'})
    }
