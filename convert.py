import os
from PIL import Image

def convert_gifs_to_pngs(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".gif"):
            gif_path = os.path.join(directory, filename)
            png_path = os.path.join(directory, filename.replace(".gif", ".png"))
            
            try:
                with Image.open(gif_path) as img:
                    img.save(png_path, "PNG")
                print(f"Converted {filename} to PNG.")
                
                os.remove(gif_path)
                print(f"Removed {filename}.")
            except Exception as e:
                print(f"Could not convert {filename}: {e}")

if __name__ == "__main__":
    public_directory = "public"
    convert_gifs_to_pngs(public_directory)
