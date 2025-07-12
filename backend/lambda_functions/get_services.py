import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('contentType').eq('service')
        )
        items = response['Items']

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(items)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }