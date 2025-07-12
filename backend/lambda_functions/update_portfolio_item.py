import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DnaWebContent')

def lambda_handler(event, context):
    try:
        item_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        item_name = body.get('name')
        item_description = body.get('description')

        update_expression = "SET #n = :name, #d = :description"
        expression_attribute_names = {'#n': 'name', '#d': 'description'}
        expression_attribute_values = {':name': item_name, ':description': item_description}

        table.update_item(
            Key={
                'contentType': 'portfolio',
                'id': item_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Portfolio item updated successfully'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': str(e)})
        }