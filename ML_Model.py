import sys

def main():
    script_name = sys.argv[0]

    arguments = sys.argv[1:]

    print(f"Script Name: {script_name}")
    # print("Arguments:", arguments)
    
    for i in range(int(arguments[1])):
        print(arguments[0])

if __name__ == "__main__":
    main()
