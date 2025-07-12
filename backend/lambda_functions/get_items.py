import json
import os
import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ.get('TABLE_NAME', 'WebsiteContent') # Default table name
    table = dynamodb.Table(table_name)

    # Determine the operation based on the path
    path = event.get('path', '/')
    http_method = event.get('httpMethod', 'GET')

    if http_method == 'GET':
        # Example path: /items/EQUIPMENT or /items/EQUIPMENT/some-uuid
        path_parts = [part for part in path.split('/') if part] # Remove empty strings

        if len(path_parts) >= 2 and path_parts[0] == 'items':
            item_type = path_parts[1].upper() # e.g., EQUIPMENT, TEAM_MEMBER

            if len(path_parts) == 3: # Fetch single item
                item_id = path_parts[2]
                try:
                    response = table.get_item(
                        Key={
                            'PK': item_type,
                            'SK': item_id
                        }
                    )
                    item = response.get('Item')
                    if item:
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps(item)
                        }
                    else:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'message': 'Item not found'})
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
            elif len(path_parts) == 2: # Fetch all items of a type
                try:
                    response = table.query(
                        KeyConditionExpression=Key('PK').eq(item_type)
                    )
                    items = response.get('Items', [])
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(items)
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
        'body': json.dumps({'message': 'Invalid request path or method'})
    }
