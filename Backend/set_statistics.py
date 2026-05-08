import numpy as np
import regex as re
import statistics

def number_set_from_string(number_set_str: str, delimiter: str):
    # error to throw if the number_set_str isn't formatted according to the delimiter
    exception = Exception('ERROR: The provided string is formatted incorrectly and could not be turned into a number set. Make sure the numbers in the string are correctly separated by your chosen delimiter.')

    # bools for if we should check to see if the next character is a digit or decimal
    check_for_digit = True;
    check_for_decimal = False;

    # patterns to check for
    digits = r'\d'
    decimal = '.'

    # raise an errors if the delimiter contains any digits
    if re.search(digits, delimiter):
        raise Exception('ERROR: Delimiter can not contain digits.')
    
    # numpy array and variable to keep track of number we are currently processing in the loop
    number_set = np.array([], dtype=float)
    new_number = ''

    # variable for how many iterations to skip
    skip_iterations = 0

    # go through every character in the string
    for i in range(len(number_set_str)):
        # skip iterations
        if skip_iterations > 0:
            skip_iterations -= 1
            continue

        # check to see if the current character is a digit
        if check_for_digit:
            digit_found = False
            additional_index = 0

            # add all digits to the new_number variable
            while re.search(digits, number_set_str[i + additional_index]):
                digit_found = True
                new_number += number_set_str[i + additional_index]
                if (i + additional_index) < len(number_set_str) - 1:
                    additional_index += 1
                else:
                    additional_index += 1
                    break

            # if a digit wasn't found raise an error
            if not digit_found:
                raise exception

            # if the following digits match the delimiter process it and then start the next loop iteration
            if number_set_str[(i + additional_index):(i + additional_index) + len(delimiter)] == delimiter:
                number_set = np.append(number_set, float(new_number))
                new_number = ''
                skip_iterations += len(delimiter) + additional_index - 1
                continue

            skip_iterations += additional_index - 1

            check_for_digit = False
            check_for_decimal = True
            continue
        elif check_for_decimal and number_set_str[i] == decimal: # check if the current character is a decimal if we are wanting to check for a decimal
            # add decimal to the new number string
            new_number += number_set_str[i]

            # go through all the digits that appear after the decimal
            additional_index = 1
            while re.search(digits, number_set_str[i + additional_index]):
                new_number += number_set_str[i + additional_index]
                if (i + additional_index) < len(number_set_str) - 1:
                    additional_index += 1
                else:
                    break

            # if the following digits match the delimiter process it and then start the next loop iteration
            if number_set_str[i + additional_index:(i + additional_index) + len(delimiter)] == delimiter:
                number_set = np.append(number_set, float(new_number))
                new_number = ''
                skip_iterations += len(delimiter) + additional_index - 1
                check_for_decimal = False
                check_for_digit = True
                continue
            elif i + additional_index == len(number_set_str) - 1: # if we are at the end of the user-generated number set end the loop
                break

        # if nothing happens in the loop iteration that means the user-generated set of numbers
        # is formatted incorrently, and therefore an error should be raised
        raise exception

    # add the final number to the number_set
    number_set = np.append(number_set, float(new_number))

    # return the final number_set
    return number_set

# take in a set of numbers and output a dictionary with several statistical functions in itcd
def number_set_statistics(number_set):
    minimum = round(np.min(number_set), 2)
    mean = round(np.mean(number_set), 2)
    median = round(np.median(number_set), 2)
    mode = round(statistics.mode(number_set), 2)
    maximum = round(np.max(number_set), 2)
    return {'min': minimum, 'mean': mean, 'median': median, 'mode': mode, 'max': maximum}