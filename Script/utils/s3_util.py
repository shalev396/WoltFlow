import os
import re
import uuid
import base64
import logging
from io import BytesIO

from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

# -----------------------------------------------------------------------------
# 1. Load .env
# -----------------------------------------------------------------------------
# This will read from a .env file in the current working directory
# and set the corresponding environment variables.
load_dotenv()

# -----------------------------------------------------------------------------
# 2. Read AWS credentials + other settings from environment
# -----------------------------------------------------------------------------
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")  # fallback region if none set
BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, BUCKET_NAME]):
    raise RuntimeError(
        "Missing one or more environment variables: "
        "AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME"
    )

# -----------------------------------------------------------------------------
# 3. Initialize S3 client with explicit credentials
# -----------------------------------------------------------------------------
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def convert_image_to_base64(image_path):
    """Convert an image file to base64 string with proper format."""
    try:
        with open(image_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            # Get the file extension
            _, ext = os.path.splitext(image_path)
            # Remove the dot from extension and convert to lowercase
            ext = ext[1:].lower() if ext else 'png' # Default to png if no extension
            # Map common image extensions to MIME types
            mime_types = {
                'png': 'image/png',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'gif': 'image/gif',
                'bmp': 'image/bmp'
            }
            mime_type = mime_types.get(ext, 'image/png') # Default to image/png if ext not found
            return f"data:{mime_type};base64,{encoded_string}"
    except FileNotFoundError:
        logging.error(f"Error converting image to base64: File not found at {image_path}")
        return None
    except Exception as e:
        logging.error(f"Error converting image to base64: {str(e)}")
        return None

def upload_image_to_s3(base64_image: str, folder: str = "images") -> str:
    """
    Upload a Base64-encoded image to S3 and return its CloudFront URL.
    :param base64_image: Base64 image string: "data:image/jpeg;base64,<data>"
    :param folder:  Folder (key prefix) in S3 bucket (e.g., "images")
    :return:         Full CloudFront URL (e.g., "https://woltflow.shalev396.com/images/UUID.jpg")
    """
    # 1. Parse the Base64 data; pattern captures "image/type" and the actual data
    match = re.match(r"^data:(?P<type>[^;]+);base64,(?P<data>.+)$", base64_image)
    if not match:
        raise ValueError("Invalid base64 image format")

    content_type = match.group("type")       # e.g., "image/jpeg"
    base64_data = match.group("data")         # the raw Base64 data
    try:
        img_bytes = base64.b64decode(base64_data)
    except base64.binascii.Error as e:
        logging.error("Base64 decoding failed: %s", e)
        raise

    # 2. Determine file extension (e.g., "jpeg" from "image/jpeg")
    extension = content_type.split("/")[-1] or "jpg"
    filename = f"{uuid.uuid4()}.{extension}"
    key = f"{folder}/{filename}"

    # 3. Upload to S3
    try:
        file_obj = BytesIO(img_bytes)
        s3.upload_fileobj(
            Fileobj=file_obj,
            Bucket=BUCKET_NAME,
            Key=key,
            ExtraArgs={"ContentType": content_type}
        )
        logging.info("Image uploaded successfully to %s/%s", BUCKET_NAME, key)
    except ClientError as e:
        logging.error("Error uploading image to S3: %s", e)
        raise

    # 4. Return the CloudFront or direct S3 URL as needed
    #    Replace 'https://mycdn.example.com' with your actual CloudFront domain
    url = f"https://woltflow.shalev396.com/{key}"
    return url
